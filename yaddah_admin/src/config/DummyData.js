import moment from "moment";
import {
  AirConditioning,
  bell,
  BuildingView,
  calendar,
  car,
  CoffeeMachine,
  dinner,
  FlatScreen,
  GardenView,
  geyser,
  hotel1,
  hotel2,
  hotel3,
  hotel4,
  hotelCard,
  hotelDetail1,
  hotelDetail2,
  hotelDetail3,
  hotelDetail4,
  hotelDetail5,
  LakeView,
  Minibar,
  PrivateBathroom,
  SoundProof,
  swimming,
  telephone,
  wifi,
} from "../constant/imagePath";
import { TiHome } from "react-icons/ti";
import { FaHotel, FaLanguage, FaSnowflake, FaWallet } from "react-icons/fa";
import { MdBedroomChild, MdCategory } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { RiHotelFill } from "react-icons/ri";

const RoomList = [
  {
    id: 1,
    category: {
      id: 1,
      name: "Delux Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: [
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
    ],
  },
  {
    id: 2,
    category: {
      id: 1,
      name: "Delux Suite",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 3,
    category: {
      id: 1,
      name: "Single Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 4,
    category: {
      id: 1,
      name: "Double Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 5,
    category: {
      id: 1,
      name: "Quad Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 6,
    category: {
      id: 1,
      name: "Queen Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 1,
    category: {
      id: 1,
      name: "Delux Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: [
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
    ],
  },
  {
    id: 2,
    category: {
      id: 1,
      name: "Delux Suite",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 3,
    category: {
      id: 1,
      name: "Single Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 4,
    category: {
      id: 1,
      name: "Double Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 5,
    category: {
      id: 1,
      name: "Quad Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 6,
    category: {
      id: 1,
      name: "Queen Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 1,
    category: {
      id: 1,
      name: "Delux Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: [
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
      "wifi",
      "parking",
    ],
  },
  {
    id: 2,
    category: {
      id: 1,
      name: "Delux Suite",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 3,
    category: {
      id: 1,
      name: "Single Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 4,
    category: {
      id: 1,
      name: "Double Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 5,
    category: {
      id: 1,
      name: "Quad Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
  {
    id: 6,
    category: {
      id: 1,
      name: "Queen Room",
    },
    noOfRooms: 20,
    price: 250,
    beds: 2,
    eventPrice: 200,
    package: 200,
    discount: 40,
    amenities: ["wifi", "parking", "wifi"],
  },
];

const AmenitiesArr = [
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
  {
    icons: calendar,
    amenities: ["wifi", "parking", "wifi"],
    createdAt: new Date(),
  },
];
const transactionData = [
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
  {
    hotel: {
      name: "Sunset Resort",
    },
    status: "paid",
    date: moment().format("DD/MM/YYYY"),
    price: 250,
  },
];

const AccordionArray = [
  {
    title: "The car parking and the wifi are always free.",
    description:
      "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone.",
  },
  {
    title: "The car parking and the wifi are always free.",
    description:
      "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone.",
  },
  {
    title: "The car parking and the wifi are always free.",
    description:
      "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone.",
  },
  {
    title: "The car parking and the wifi are always free.",
    description:
      "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone.",
  },
  {
    title: "The car parking and the wifi are always free.",
    description:
      "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone.",
  },
];

const hotelListing = {
  location: "Kathmandu",
  propertyCount: 410,
  listing: [
    {
      images: [hotel1, hotel2, hotel3, hotel4],
      isFeatured: true,
      ratingsAverage: 4,
      location: "karachi",
      name: "Hotel Jampa",
      discount: "50%",
      reviews: [1, 2, 3, 4, 5],
      isFavorited: true,
      amenities: [
        {
          img: car,
          title: "Parking Facility",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
        {
          img: dinner,
          title: "Famiy Room",
        },
        {
          img: swimming,
          title: "Swimming Pool",
        },
        {
          img: telephone,
          title: "24/7 Response",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
      ],
      price: 180,
      selectedCurrency: "QAR",
      freeCancellation: true,
      allowedDiscount: true,
    },
    {
      images: [hotel1, hotel2, hotel3, hotel4],
      isFeatured: true,
      ratingsAverage: 4,
      location: "karachi",
      name: "Hotel Jampa",
      discount: "50%",
      reviews: [1, 2, 3, 4, 5],
      isFavorited: false,
      amenities: [
        {
          img: car,
          title: "Parking Facility",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
        {
          img: dinner,
          title: "Famiy Room",
        },
        {
          img: swimming,
          title: "Swimming Pool",
        },
        {
          img: telephone,
          title: "24/7 Response",
        },
      ],
      price: 180,
      selectedCurrency: "QAR",
      freeCancellation: true,
    },
    {
      images: [hotel1, hotel2, hotel3, hotel4],
      isFeatured: true,
      ratingsAverage: 4,
      location: "karachi",
      name: "Hotel Jampa",
      discount: "50%",
      reviews: [1, 2, 3, 4, 5],
      isFavorited: false,
      amenities: [
        {
          img: car,
          title: "Parking Facility",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
        {
          img: dinner,
          title: "Famiy Room",
        },
        {
          img: swimming,
          title: "Swimming Pool",
        },
        {
          img: telephone,
          title: "24/7 Response",
        },
      ],
      price: 180,
      selectedCurrency: "QAR",
      freeCancellation: true,
      allowedDiscount: true,
    },
    {
      images: [hotel1, hotel2, hotel3, hotel4],
      isFeatured: true,
      ratingsAverage: 4,
      location: "karachi",
      name: "Hotel Jampa",
      discount: "50%",
      reviews: [1, 2, 3, 4, 5],
      isFavorited: false,
      amenities: [
        {
          img: car,
          title: "Parking Facility",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
        {
          img: dinner,
          title: "Famiy Room",
        },
        {
          img: swimming,
          title: "Swimming Pool",
        },
        {
          img: telephone,
          title: "24/7 Response",
        },
      ],
      price: 180,
      selectedCurrency: "QAR",
      freeCancellation: true,
    },
    {
      images: [hotel1, hotel2, hotel3, hotel4],
      isFeatured: true,
      ratingsAverage: 4,
      location: "karachi",
      name: "Hotel Jampa",
      discount: "50%",
      reviews: [1, 2, 3, 4, 5],
      isFavorited: false,
      amenities: [
        {
          img: car,
          title: "Parking Facility",
        },
        {
          img: wifi,
          title: "Free Wifi",
        },
        {
          img: geyser,
          title: "Geyser",
        },
        {
          img: bell,
          title: "Fitness Center",
        },
        {
          img: dinner,
          title: "Famiy Room",
        },
        {
          img: swimming,
          title: "Swimming Pool",
        },
        {
          img: telephone,
          title: "24/7 Response",
        },
      ],
      price: 180,
      selectedCurrency: "QAR",
      freeCancellation: true,
    },
  ],
};

const BookingList = [
  {
    id: 1,
    user: {
      id: 1,
      name: "John Denly",
      phone: "12312312312",
      email: "john@gmail.com",
    },
    price: 250,
    createdAt: moment().add(-25, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 2,
    user: {
      id: 1,
      name: "Den Lee",
      phone: "12312312312",
      email: "denlee@gmail.com",
    },
    price: 250,
    createdAt: moment().add(-35, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "John Denly",
      phone: "12312312312",
      email: "john@gmail.com",
    },
    price: 250,
    createdAt: moment().add(-15, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "Den Lee",
      phone: "12312312312",
      email: "denlee@gmail.com",
    },
    price: 250,
    createdAt: moment().add(1, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "John Denly",
      phone: "12312312312",
      email: "john@gmail.com",
    },
    price: 250,
    createdAt: moment().add(9, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "Den Lee",
      phone: "12312312312",
      email: "denlee@gmail.com",
    },
    price: 250,
    createdAt: moment().add(25, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "John Denly",
      phone: "12312312312",
      email: "john@gmail.com",
    },
    price: 250,
    createdAt: moment().add(30, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
  {
    id: 1,
    user: {
      id: 1,
      name: "Den Lee",
      phone: "12312312312",
      email: "denlee@gmail.com",
    },
    price: 250,
    createdAt: moment().add(40, "days").format(),
    checkIn: moment().add(5, "days").format(),
    checkOut: moment().add(10, "days").format(),
  },
];

const userBookingsData = [
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
  {
    hotel: { name: "Sunset Resort" },
    category: { name: "Deluxe Room" },
    amount: 350,
    date: "22-09-2022",
    package: { title: "1 Deluxe Room" },
  },
];

const hotelCards = [
  {
    image: hotel1,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: true,
  },
  {
    image: hotel1,
    discountedPrice: "10% Off",
    isFavorited: true,
    name: "Khatmandu",
  },
  {
    image: hotel1,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: false,
  },
  {
    image: hotelCard,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: true,
  },
  {
    image: hotelCard,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: false,
  },
  {
    image: hotelCard,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: true,
  },
  {
    image: hotelCard,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: true,
  },
  {
    image: hotelCard,
    discountedPrice: "10% Off",
    name: "Khatmandu",
    isFavorited: true,
  },
];

const SideBarMenuForAdmin = [
  {
    name: "Home",
    path: "/",
    icon: <TiHome size={24} />,
  },
  {
    name: "New Hotel",
    path: "/new-hotels",
    icon: <FaHotel size={24} />,
  },
  {
    name: "All Hotel",
    path: "/all-hotels",
    icon: <FaHotel size={24} />,
  },
  {
    name: "Withdraw Request",
    path: "/withdraw-requests",
    icon: <FaWallet size={24} />,
  },
  {
    name: "Hotel Categories",
    path: "/hotel-categories",
    icon: <MdCategory size={24} />,
  },
  {
    name: "Room Categories",
    path: "/room-categories",
    icon: <MdBedroomChild size={24} />,
  },
  {
    name: "Amenities",
    path: "/amenities",
    icon: <FaSnowflake size={24} />,
  },
  {
    name: "Hotel Languages",
    path: "/languages",
    icon: <FaLanguage size={24} />,
  },
  {
    name: "Facility",
    path: "/facility",
    icon: <RiHotelFill size={24} />,
  },
  {
    name: "Logout",
    path: "logout",
    icon: <IoLogOut size={24} />,
  },
];

const AllHostelListing = [
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
  {
    _id: 2,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
  {
    _id: 3,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
  {
    _id: 4,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
  {
    _id: 5,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
  {
    _id: 6,
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    phone: "+921 2345458",
    hotelName: "Hotel Jampa",
    location: "Newyork, USA",
  },
];
const allWithDrawRequest = [
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    hotelName: "Sunset Resort",
    roomType: "Deluxe",
    status: "Paid",
    createdAt: new Date(),
    amount: "250.00",
  },
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    hotelName: "Sunset Resort",
    roomType: "Deluxe",
    status: "Paid",
    createdAt: new Date(),
    amount: "250.00",
  },
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    hotelName: "Sunset Resort",
    roomType: "Deluxe",
    status: "Paid",
    createdAt: new Date(),
    amount: "250.00",
  },
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    hotelName: "Sunset Resort",
    roomType: "Deluxe",
    status: "Paid",
    createdAt: new Date(),
    amount: "250.00",
  },
  {
    _id: 1,
    firstName: "Test",
    lastName: "User",
    hotelName: "Sunset Resort",
    roomType: "Deluxe",
    status: "Paid",
    createdAt: new Date(),
    amount: "250.00",
  },
];

const categoryArr = [
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
  {
    categoryName: "Cleanliness",
    progressPercent: "80",
    rating: "4.8",
  },
];
const guestReviewsArr = [
  {
    user: { name: "Ahmed Karim", avatar: null },
    createdAt: "October 8, 2019",
    ratedByUSer: {
      rating: 5,
      text: "Excellent Service and product throughout",
    },
    booking: {
      checkIn: "October 8, 2019",
      checkOut: "October 26, 2019",
      bookFor: "Family",
      title: "Deluxe double or Twin room",
    },
    ratedByHotel: { text: "Thank you for your review and choosing" },
  },
  {
    user: { name: "Ahmed Karim", avatar: null },
    createdAt: "October 8, 2019",
    ratedByUSer: {
      rating: 5,
      text: "Excellent Service and product throughout",
    },
    booking: {
      checkIn: "October 8, 2019",
      checkOut: "October 26, 2019",
      bookFor: "Family",
      title: "Deluxe double or Twin room",
    },
    ratedByHotel: { text: "Thank you for your review and choosing" },
  },
  {
    user: { name: "Ahmed Karim", avatar: null },
    createdAt: "October 8, 2019",
    ratedByUSer: {
      rating: 5,
      text: "Excellent Service and product throughout",
    },
    booking: {
      checkIn: "October 8, 2019",
      checkOut: "October 26, 2019",
      bookFor: "Family",
      title: "Deluxe double or Twin room",
    },
    ratedByHotel: { text: "Thank you for your review and choosing" },
  },
];

const reserveData = {
  hotel: {
    title: "Oasis Kathmandu Hotel",
    rating: 4.5,
    description:
      "Al waab street, Aspire zone, Aspire zone - Sport city Doha and Dawjah Qatar 22833",
  },
  booking: {
    checkIn: "10 Oct 2022",
    checkOut: "13 Oct 2022",
    totalStays: "3 Nights",
  },
  room: {
    perDay: 4433,
    discount: 296,
    taxAndFees: 220,
    coffeeAndTea: true,
    freeWifi: true,
    drinkingWater: true,
    expressCheckIn: true,
  },
};

const hotelDetails = {
  images: [
    hotelDetail1,
    hotelDetail2,
    hotelDetail3,
    hotelDetail4,
    hotelDetail5,
  ],
  title: "Oasis Kathmandu Hotel",
  description:
    "The car parking and the wifi are always free, so you can stay touch and come and go as you  please. Conveniently. situated in the Ashpire Zone - Sports City part of Doha, this property puts you close to attractions and interesting dining option. Don’t leave before paying a visit to the famous Souq Waqif. Rated with 5 stars this high quality property provides guests with access to massage, restaurant, fitness center on site.",
  rooms: [
    {
      title: "Deluxe Room",
      amenities: [
        { title: "Lake View", icon: LakeView },
        { title: "Building View", icon: BuildingView },
        { title: "Air Conditioning", icon: AirConditioning },
        { title: "Free Wifi", icon: wifi },
        { title: "Sound Proof", icon: SoundProof },
        { title: "Minibar", icon: Minibar },
        { title: "Garden View", icon: GardenView },
        { title: "Pool View", icon: swimming },
        { title: "Private Bathroom", icon: PrivateBathroom },
        { title: "Flat Screen TV", icon: FlatScreen },
        { title: "Coffee Machine", icon: CoffeeMachine },
      ],
      images: [
        hotelDetail1,
        hotelDetail2,
        hotelDetail3,
        hotelDetail4,
        hotelDetail5,
      ],
      childrens: 2,
      adults: 0,
      packages: [
        {
          isRecommended: true,
          options: [
            "Breakfast included for 4 guests",
            "Room With Free Cancellation | Breakfast only",
            "Free Cancellation",
            "More details",
          ],
          discount: 79,
          price: "168",
        },
        {
          title: "Room With Free Cancellation | Breakfast + Lunch and Dinner",
          options: [
            "Free Cancellation",
            "Free lunch or dinner",
            "2 Meal - Breakfast and Lunch or Dinner including 4 guest",
            "More details",
          ],
          discount: 79,
          price: "168",
        },
        {
          title: "Room With Free Cancellation | Breakfast + Lunch/Dinner",
          options: [
            "Free Cancellation",
            "No need to pay right now. Only credit card details required",
            "Free Breakfast and Lunch/Dinner",
            "Free self parking",
            "Breakfast Buffet",
            "Half Board",
            "Free Wifi",
            "More details",
          ],
          discount: 79,
          price: "168",
        },
      ],
    },

    // Room 2
    {
      title: "Deluxe Room",
      amenities: [
        { title: "Lake View", icon: LakeView },
        { title: "Building View", icon: BuildingView },
        { title: "Air Conditioning", icon: AirConditioning },
      ],
      childrens: 2,
      adults: 2,
      images: [
        hotelDetail1,
        hotelDetail2,
        hotelDetail3,
        hotelDetail4,
        hotelDetail5,
      ],

      packages: [
        {
          title: "Room With Free Cancellation | Breakfast + Lunch and Dinner",
          options: [
            "Free Cancellation",
            "Free Wifi",
            "Free self parking",
            "Free Breakfast",
            "More details",
          ],
          discount: 79,
          price: "168",
        },
        {
          title: "Room With Free Cancellation | Breakfast + Lunch/Dinner",
          options: [
            "Free Cancellation",
            "Free Wifi",
            "Free self parking",
            "Free Breakfast",
            "More details",
          ],
          discount: 79,
          price: "168",
        },
      ],
    },
  ],
};

// Admin Data
const adminHotelDetail = {
  isApproved: false,
  hotelManager: {
    name: "John Denly",
    phone: "+921 123 456 789",
    email: "johndenly@gmail.com",
    address: "Newyork, USA",
  },
  hotelDetails: {
    name: "Sunset Resort",
    class: "5 Star",
    address: "Newyork, USA",
    meal: "Breakfast",
    discount: "20% Discount",
    freeCancellation: true,
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page w",
    images: [
      hotelDetail1,
      hotelDetail2,
      hotelDetail3,
      hotelDetail4,
      hotelDetail5,
    ],
  },
  roomDetails: {
    category: "Deluxe",
    roomCount: 2,
    pricePerDay: 250,
    discount: "20%",
    noOfAdults: 2,
    noOfChildrens: 2,
    noOfBeds: 2,
    amenities: ["Parking", "Wifi", "Room Services"],
    images: [
      hotelDetail1,
      hotelDetail2,
      hotelDetail3,
      hotelDetail4,
      hotelDetail5,
    ],
  },
  eventDetails: {
    name: "Conference Event",
    date: "02-08-2022",
    price: 250,
  },
  packageDetails: {
    name: "Conference Event",
    date: "02-08-2022",
    price: 250,
    isRecommended: true,
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page w",
  },
};
const detailCardArr = [
  {
    title: "Room With Free Cancellation | Breakfast + Lunch and Dinner",
    isRecommended: true,
    options: [
      "Free Cancellation",
      "Free Wifi",
      "Free self parking",
      "Free Breakfast",
      "More details",
    ],
    childrens: 2,
    adults: 2,
    discount: 79,
    price: "168",
  },
  {
    title: "Room With Free Cancellation | Breakfast + Lunch and Dinner",
    isRecommended: true,
    options: [
      "Free Cancellation",
      "Free Wifi",
      "Free self parking",
      "Free Breakfast",
      "More details",
    ],
    childrens: 2,
    adults: 2,
    discount: 79,
    price: "168",
  },
];

export {
  RoomList,
  AccordionArray,
  transactionData,
  hotelListing,
  BookingList,
  userBookingsData,
  hotelCards,
  SideBarMenuForAdmin,
  AllHostelListing,
  categoryArr,
  guestReviewsArr,
  reserveData,
  hotelDetails,
  adminHotelDetail,
  allWithDrawRequest,
  AmenitiesArr,
  detailCardArr,
};
