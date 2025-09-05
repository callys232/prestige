import Navbar from "../../../../components/Navbar";
import AboutUs from "../../../../components/aboutUs/AboutUs";
 import Trainers from "../../../../components/aboutUs/Trainers";
import Footer from "../../../../components/Footer";

const AboutUsPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
     <AboutUs />
     <Trainers />
      <Footer />
    </div>
  );
};

export default AboutUsPage;
