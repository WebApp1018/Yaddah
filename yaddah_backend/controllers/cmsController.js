const Cms = require('../models/cmsModel');
const SocialLinks = require('../models/socialLinksCrudModel');
const WhyChooseUs = require('../models/whyChooseUsCrudModel');
const Faqs = require('../models/faqModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadFilesToS3 } = require('../utils/uploadFilesToS3');
const { deleteFile } = require('../utils/fileUpload');

exports.updatePage = catchAsync(async (req, res, next) => {
  let { _id, pageName, delSliderImages } = req.body;
  const { files } = req;

  if (!_id || !pageName) return next(new AppError('args are missing.', 400));

  const foundPage = await Cms.findById(_id);

  let outter = {
    [pageName]: { ...req.body },
  };
  req.body[pageName] = outter[pageName];

  //home
  if (delSliderImages) {
    delSliderImages =
      typeof delSliderImages == 'string' ? [delSliderImages] : delSliderImages;

    await Promise.all([
      delSliderImages.map(async (imgKey) => {
        await deleteFile(imgKey);
      }),
    ]);

    req.body[pageName].home_slider_images = foundPage[
      pageName
    ].home_slider_images.filter((imgKey) => !delSliderImages.includes(imgKey));
  } else
    req.body[pageName].home_slider_images =
      foundPage[pageName].home_slider_images;

  if (files?.home_slider_images) {
    const resolveImagesPromise = files?.home_slider_images.map(
      async (img, i) => {
        return await uploadFilesToS3(files, 'home_slider_images', i, 30);
      }
    );

    const resolvedImages = await Promise.all(resolveImagesPromise);

    req.body[pageName].home_slider_images = [
      ...req.body[pageName].home_slider_images,
      ...resolvedImages,
    ];
  }

  if (files?.home_section1_image) {
    if (foundPage[pageName].home_section1_image)
      await deleteFile(foundPage[pageName].home_section1_image);

    req.body[pageName].home_section1_image = await uploadFilesToS3(
      files,
      'home_section1_image',
      0,
      30
    );
  }

  if (files?.home_section2_image) {
    if (foundPage[pageName].home_section2_image)
      await deleteFile(foundPage[pageName].home_section2_image);

    req.body[pageName].home_section2_image = await uploadFilesToS3(
      files,
      'home_section2_image',
      0,
      30
    );
  }

  if (files?.home_section4_image) {
    if (foundPage[pageName].home_section4_image)
      await deleteFile(foundPage[pageName].home_section4_image);

    req.body[pageName].home_section4_image = await uploadFilesToS3(
      files,
      'home_section4_image',
      0,
      30
    );
  }

  if (files?.home_section4_bgImage) {
    if (foundPage[pageName].home_section4_bgImage)
      await deleteFile(foundPage[pageName].home_section4_bgImage);

    req.body[pageName].home_section4_bgImage = await uploadFilesToS3(
      files,
      'home_section4_bgImage',
      0,
      30
    );
  }

  if (files?.home_section5_bgImage) {
    if (foundPage[pageName].home_section5_bgImage)
      await deleteFile(foundPage[pageName].home_section5_bgImage);

    req.body[pageName].home_section5_bgImage = await uploadFilesToS3(
      files,
      'home_section5_bgImage',
      0,
      30
    );
  }

  //about us
  if (files?.about_section2_image) {
    if (foundPage[pageName].about_section2_image)
      await deleteFile(foundPage[pageName].about_section2_image);

    req.body[pageName].about_section2_image = await uploadFilesToS3(
      files,
      'about_section2_image',
      0,
      30
    );
  }

  if (files?.about_section3_image) {
    if (foundPage[pageName].about_section3_image)
      await deleteFile(foundPage[pageName].about_section3_image);

    req.body[pageName].about_section3_image = await uploadFilesToS3(
      files,
      'about_section3_image',
      0,
      30
    );
  }

  if (files?.about_section3_bgImage) {
    if (foundPage[pageName].about_section3_bgImage)
      await deleteFile(foundPage[pageName].about_section3_bgImage);

    req.body[pageName].about_section3_bgImage = await uploadFilesToS3(
      files,
      'about_section3_bgImage',
      0,
      30
    );
  }

  if (files?.about_section4_bgImage) {
    if (foundPage[pageName].about_section4_bgImage)
      await deleteFile(foundPage[pageName].about_section4_bgImage);

    req.body[pageName].about_section4_bgImage = await uploadFilesToS3(
      files,
      'about_section4_bgImage',
      0,
      30
    );
  }

  const doc = await Cms.findByIdAndUpdate(_id, req.body, { new: true });

  res.status(200).json({
    status: 'success',
    data: doc[pageName],
  });
});

exports.getDynamicPage = catchAsync(async (req, res, next) => {
  let { pages, all } = req.query;

  if (all == 'true') {
    const d = await Cms.find();
    const socialLinks = await SocialLinks.find();
    const whyChooseUs = await WhyChooseUs.find();
    const faqs = await Faqs.find({ userType: 'admin' });

    const pagesDynamicArray = [
      'home',
      'about_us',
      'services',
      'faq',
      'contact_us',
      'footer',
    ];
    let newArray = [];
    d.map((item, i) => {
      pagesDynamicArray.map((pg) => {
        if (item[pg]) {
          if (item[pg].pageName == 'footer') item[pg].socialLinks = socialLinks;
          if (item[pg].pageName == 'faq') item[pg].faqs = faqs;
          if (['home', 'about_us'].includes(item[pg].pageName))
            item[pg].whyChooseUs = whyChooseUs;
          item[pg]._id = item?._id;
          newArray.push(item[pg]);
        }
      });
    });

    res.status(200).json({
      status: 'success',
      results: newArray.length,
      pages: newArray,
    });
  } else {
    let doc = {};

    const d = await Cms.findOne({ [pages]: { $exists: true } }).lean();

    doc = d[pages];

    res.status(200).json({
      status: 'success',
      data: {
        pages: doc,
      },
    });
  }
});
