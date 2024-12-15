import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateAsc = data?.focus.sort(
    (evtA, evtB) => new Date(evtA.date) - new Date(evtB.date)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % byDateAsc.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [byDateAsc]);

  return (
    <div className="SlideCardList">
      {byDateAsc?.map((evt, idx) => (
        <div
          key={evt.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={evt.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{evt.title}</h3>
              <p>{evt.description}</p>
              <div>{getMonth(new Date(evt.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateAsc?.map((evt, radioIdx) => (
            <input
              key={`radio-${evt.title}`}
              type="radio"
              name="radio-button"
              checked={radioIdx === index}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
