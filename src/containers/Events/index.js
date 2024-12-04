import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9; // Nombre d'événements affichés par page

const EventList = () => {
  const { data, error } = useData(); // Récupère les données du contexte global
  const [type, setType] = useState(); // État local pour stocker la catégorie sélectionnée
  const [currentPage, setCurrentPage] = useState(1); // État local pour stocker la page actuelle

  // Filtrage des événements par catégorie et pagination
  const filteredEvents = (
    (!type // Si aucune catégorie n'est sélectionnée
      ? data?.events // Prend tous les événements
      : data?.events.filter((event) => event.type === type)) || []
  ) // Sinon, filtre par la catégorie sélectionnée
    .filter((event, index) => {
      // Pagination des événements
      if (
        (currentPage - 1) * PER_PAGE <= index && // Vérifie si l'événement appartient à la page actuelle
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    });

  // Fonction pour changer la catégorie sélectionnée
  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialise à la première page lors du changement de catégorie
    setType(evtType); // Met à jour la catégorie sélectionnée
  };

  // Liste unique des catégories disponibles
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)} // Passe les catégories disponibles au composant Select
            onChange={(value) => changeType(value)} // Applique le changement de catégorie via Select
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[
              ...Array(
                Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1
              ),
            ].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
