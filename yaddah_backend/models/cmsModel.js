const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    home: {
      type: {
        pageName: { type: String, default: 'home' },
        //Section---1
        home_section1_image: String,
        home_section1_title: String,
        home_section1_description: String,

        //Section --- 2
        home_slider_images: [String],

        //Section --- 3
        home_section2_title: String,
        home_section2_image: String,
        home_section2_description: String,

        //Section --- 4
        home_section3_title: String,
        home_section3_image: String,

        //CRUD

        //Section --- 5
        home_section4_title: String,
        home_section4_bgImage: String,

        //CRUD

        //Section --- 6
        home_section5_title: String,
        home_section5_description: String,
        home_section5_bgImage: String,
        home_section5_counter1: String,
        home_section5_counter1_value1: String,
        home_section5_counter2: String,
        home_section5_counter2_value2: String,
        home_section5_counter3: String,
        home_section5_counter3_value3: String,
        home_section5_counter4: String,
        home_section5_counter4_value4: String,
      },
    },
    about_us: {
      type: {
        // main
        pageName: { type: String, default: 'about_us' },

        //Section-1
        about_section1_heading: String,

        //Section-2
        about_section2_title: String,
        about_section2_description: String,
        about_section2_image: String,

        //CRUD

        //Section-3
        about_section3_title: String,
        about_section3_image: String,
        about_section3_bgImage: String,

        //Section --- 4
        about_section4_title: String,
        about_section4_description: String,
        about_section4_bgImage: String,
        about_section4_counter1: String,
        about_section4_counter1_value1: String,
        about_section4_counter2: String,
        about_section4_counter2_value2: String,
        about_section4_counter3: String,
        about_section4_counter3_value3: String,
        about_section4_counter4: String,
        about_section4_counter4_value4: String,
      },
    },
    services: {
      type: {
        pageName: { type: String, default: 'services' },
        services_section1_heading: String,
      },
    },
    faq: {
      type: {
        pageName: { type: String, default: 'faq' },
        faq_section1_heading: String,
      },
    },
    contact_us: {
      type: {
        pageName: { type: String, default: 'contact_us' },
        contact_section_heading: String,
        contact_section_phone1: String,
        contact_section_phone2: String,
        contact_section_email1: String,
        contact_section_email2: String,
        contact_section_address: String,
      },
    },
    footer: {
      type: {
        pageName: { type: String, default: 'footer' },
        description: String,
        email: String,
        phone: String,
        address: String,
      },
    },
  },
  { timestamps: true }
);
const Cms = mongoose.model('Cms', cmsSchema);

module.exports = Cms;
