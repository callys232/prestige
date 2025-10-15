import Navbar from "../../components/Navbar";
import Member from "../../components/membership/Member";
import Tour from "../../components/membership/Tour";
import Footer from "../../components/Footer";

const MembershipPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
      <Member />
      <Tour />
      <Footer />
    </div>
  );
};

export default MembershipPage;
