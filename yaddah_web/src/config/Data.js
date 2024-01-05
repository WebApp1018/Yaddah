import {
  totalUsersSvg,
  newServiceProviderRequestSvg,
  totalEarningsSvg,
} from "../constant/imagePath";

import {
  categoryPhotography,
  categoryVenue,
  categoryStudio,
} from "../constant/imagePath";

import {
  ServicesOne,
  ServicesTwo,
  ServicesThree,
  ServicesFour,
  ServicesFive,
} from "../constant/imagePath";
//Images
import {
  totalServiceProvidersSvg,
  newUserRequestSvg,
  totalSubServiceProviderSvg,
} from "../constant/imagePath";

import {
  whyChooseUsSubject,
  whyChooseUsSvg,
  whyChooseUsUsers,
  whyChooseUsStonks,
  whyChooseUsStar,
} from "../constant/imagePath";

export const bookingData = [
  {
    clientName: "john smith",
    clientEmail: "johnsmith@yaddah.com",
    bookingNumber: 1232,
    staffName: "Liam",
    bookingDate: "20230101",
    bookingTime: "20230101",
  },
  {
    clientName: "john smith",
    clientEmail: "johnsmith@yaddah.com",
    bookingNumber: 1232,
    staffName: "Liam",
    bookingDate: "20230101",
    bookingTime: "20230101",
  },
  {
    clientName: "john smith",
    clientEmail: "johnsmith@yaddah.com",
    bookingNumber: 1232,
    staffName: "Liam",
    bookingDate: "20230101",
    bookingTime: "20230101",
  },
];

export const revenueData = [
  {
    icon: totalUsersSvg,
    data: "$" + 600,
    desc: "Total Earnings",
  },
  {
    icon: totalEarningsSvg,
    data: "$" + 50,
    desc: "Ongoing Month Earning",
  },
  {
    icon: newServiceProviderRequestSvg,
    data: "$" + 80,
    desc: "LastMonth Earning",
  },
];
export const earningData = [
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "silver",
    orderDate: "20230101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "gold",
    orderDate: "20230101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "silver",
    orderDate: "20220101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "platinum",
    orderDate: "20230101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "silver",
    orderDate: "20220101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "gold",
    orderDate: "20220101",
    orderPrice: 99.0,
  },
  {
    serviceProviderName: "john smith",
    serviceProviderEmail: "johnsmith@yaddah.com",
    packageType: "silver",
    orderDate: "20220101",
    orderPrice: 99.0,
  },
];

export const subcriptionData = [
  {
    subcriptionDate: "20230101",
    subcriptionPlan: "Annually",
    status: "Active",
    amount: 600,
  },
  {
    subcriptionDate: "20230101",
    subcriptionPlan: "Annually",
    status: "Active",
    amount: 600,
  },
  {
    subcriptionDate: "20230101",
    subcriptionPlan: "Annually",
    status: "Active",
    amount: 600,
  },
];

export const venueData = [
  {
    name: "Photographers",
    img: categoryPhotography,
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing e, fuga dolorum aliquam temporibus",
  },
  {
    name: "Venue",
    img: categoryVenue,
    description:
      "Lorem ipsum dolor, siatis quos exercitationem ea perferendis, fuga dolorum aliquam ",
  },
  {
    name: "Studio",
    img: categoryStudio,
    description:
      "Lorem ipsum dolor, sit aciatis quos exercitationem ea perferendis, fuga dolorum aliquam ",
  },
];

export const StaffData = [
  {
    firstName: "john",
    lastName: "smith",
    email: "john@example.com",
    desc: "subAdmin lorem aaaaa nnnnnn mmmmmmm bbbbbbbbbbbb NN MMJ GG  FF  HHHHH",
    userAvatar: require("../assets/images/userAvatar.png"),
  },
  {
    firstName: "john",
    lastName: "smith",
    email: "john@example.com",
    desc: "subAdmin",
    userAvatar: require("../assets/images/userAvatar.png"),
  },
  {
    firstName: "john",
    lastName: "smith",
    email: "john@example.com",
    desc: "subAdmin",
    userAvatar: require("../assets/images/userAvatar.png"),
  },
  {
    firstName: "john",
    lastName: "smith",
    email: "john@example.com",
    desc: "subAdmin",
    userAvatar: require("../assets/images/userAvatar.png"),
  },
  {
    firstName: "john",
    lastName: "smith",
    email: "john@example.com",
    desc: "subAdmin",
    userAvatar: require("../assets/images/userAvatar.png"),
  },
];

export const dashboardData = [
  {
    icon: totalUsersSvg,
    data: 600,
    desc: "total users",
  },
  {
    icon: totalServiceProvidersSvg,
    data: 50,
    desc: "total service provider",
  },
  {
    icon: newUserRequestSvg,
    data: 80,
    desc: "new users requests",
  },
  {
    icon: newServiceProviderRequestSvg,
    data: 85,
    desc: "new service provider request",
  },
  {
    icon: totalEarningsSvg,
    data: "$" + 2000,
    desc: "earnings",
  },
  {
    icon: totalSubServiceProviderSvg,
    data: 400,
    desc: "total subcribed service provider",
  },
];
export const latestNotificationData = [
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
  {
    data: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    time: "20111031",
  },
];

export const notificationsData = [
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "1",
  },
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "10",
  },
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "1",
  },
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "12",
  },
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "1",
  },
  {
    text: "Let's meet at starbucks today, are you free?",
    time: "1",
  },
];

export const servicesData = [
  {
    img: ServicesOne,
    title: "Photographers",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
  {
    img: ServicesTwo,
    title: "Venue",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
  {
    img: ServicesThree,
    title: "Studio",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
  {
    img: ServicesFour,
    title: "Photographers",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
  {
    img: ServicesFive,
    title: "Venue",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
  {
    img: ServicesOne,
    title: "Studio",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illum non temporibus possimus facere! Aperiam neque at",
  },
];

export const faqData = [
  {
    question: "What is the process to be a part of charity?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
  },
  {
    question: "What is the process to be a part of charity?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
  },
  {
    question: "What is the process to be a part of charity?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
  },
  {
    question: "What is the process to be a part of charity?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
  },
];

export const categoryData=[
  {
    title: "Photographers",
    img: categoryPhotography,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis quos exercitationem ea perferendis, fuga dolorum aliquam temporibus deleniti non veritatis voluptatibus asperiores animi sequi velit eaque dolore eos dignissimos",
  },
  {
    title: "Video",
    img: categoryStudio,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis quos exercitationem ea perferendis, fuga dolorum aliquam temporibus deleniti non veritatis voluptatibus asperiores animi sequi velit eaque dolore eos dignissimos",
  },
  {
    title: "Photographers",
    img: categoryPhotography,
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis quos exercitationem ea perferendis, fuga dolorum aliquam temporibus deleniti non veritatis voluptatibus asperiores animi sequi velit eaque dolore eos dignissimos",
  },
]

export  const WhyChooseData = [
  {
    img: whyChooseUsUsers,
    title: "Meet New Customers",
    desc: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do usmod tempor dunt ut labore et dolorie magna aliqua. ",
  },
  {
    img: whyChooseUsStonks,
    title: "Grow Your Revenue",
    desc: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do usmod tempor dunt ut labore et dolorie magna aliqua. ",
  },
  {
    img: whyChooseUsStar,
    title: "Build your online Reputation",
    desc: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do usmod tempor dunt ut labore et dolorie magna aliqua. ",
  },
];