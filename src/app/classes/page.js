import Navbar from "../../components/Navbar";
import Classes from "../../components/classes/Classes";
import Trainers from "../../components/classes/Trainers";
import Footer from "../../components/Footer";

const ClassesPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
      <Trainers />
      <Classes />
      <Footer />
    </div>
  );
};

export default ClassesPage;
