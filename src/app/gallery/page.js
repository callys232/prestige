import Navbar from "@/components/Navbar";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Footer from "@/components/Footer";

const GalleryPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar />
      <GalleryGrid />
      <Footer />
    </div>
  );
};

export default GalleryPage;
