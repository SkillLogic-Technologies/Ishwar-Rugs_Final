import { useEffect } from "react";
import axios from "axios";

const TrackVisit = () => {
  useEffect(() => {
    const track = async () => {
      try {
        await axios.post(
          "/api/activity/track-visit",
          {},
          {
            withCredentials: true,
          }
        );
      } catch {
        // tracking is non-critical, silently fail
      }
    };

    track();
  }, []);

  return null;
};

export default TrackVisit;
