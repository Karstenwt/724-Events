import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null); // Gestion des erreurs
  const [data, setData] = useState(null); // Stockage des données récupérées

  // Fonction pour récupérer les données
  const getData = useCallback(async () => {
    try {
      console.log("Appel à l'API pour charger les données..."); // Debug
      const fetchedData = await api.loadData();
      console.log("Données récupérées depuis l'API :", fetchedData); // Debug
      setData(fetchedData); // Stockage des données dans `data`
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err); // Debug
      setError(err);
    }
  }, []);

  // Utilisation d'un effet pour charger les données au démarrage
  useEffect(() => {
    if (data) {
      console.log("Données déjà présentes, pas de nouvel appel à l'API.");
      return;
    }
    console.log("Tentative de chargement des données..."); // Debug
    getData();
  }, [data, getData]);

  // Calcul de la dernière donnée (last)
  const last = data?.events?.[data.events.length - 1] || null;

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
