import { useEffect } from "react";
import axios from "axios";

const TrackVisit = () => {
  useEffect(() => {
    const track = async () => {
      await axios.post(
        "/api/activity/track-visit",
        {},
        {
          withCredentials: true, 
        }
      );
    };

    track();
  }, []);

  return null;
};

export default TrackVisit;
