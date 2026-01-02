import LeftSidebar from "../components/LeftSide";
import GetPosts from "./GEtPosts"; // your existing GetPosts page
import "../CSS/home.css"; // for layout styling

const Home = () => {
  return (
   <div className="home-container">
      <LeftSidebar />
      <div className="main-content">
        <GetPosts />
      </div>
    </div>
  );
};

export default Home;
