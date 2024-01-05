import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

export function decideSocailIcon(type, className) {
  if (type == "facebook") return <FaFacebookF className={className} />;
  else if (type == "twitter") return <FaTwitter className={className} />;
  else if (type == "linkedIn") return <FaLinkedinIn className={className} />;
  else if (type == "instagram") return <FaInstagram className={className} />;
  else return "";
}
