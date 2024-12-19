import "./About.css";
import { useTheme } from "@emotion/react";

const About = () => {
  const theme = useTheme();

  // bgcolor and text color are inverted based on theme
  const containerName =
    theme.palette.mode === "light" ? "lightInfoContainer" : "darkInfoContainer";
  const sectionName =
    theme.palette.mode === "light" ? "lightInfoSection" : "darkInfoSection";

  return (
    <div className={containerName}>
      <div className={sectionName}>
        <h3>Tekijä: Simo Alanne</h3>
      </div>
      <div className={sectionName}>
        <h3>Käyttöohjeet:</h3>
        <p>
          Sovelluksessa on 3 eri näkymää sekä avautuva sivupalkki asetuksille.
          <br />
          <br />
          <strong>Tehtävät:</strong> Täällä voit lisätä, muokata ja poistaa
          tehtäviä. Lisäksi voit lisätä ja poistaa tägejä sovelluksesta sekä suodattaa tehtäviä
          tägien perusteella jos tehtävillä tägejä löytyy. Drag and Drop toiminnallisuus jäi
          tekemättä, mutta järjestystä voi kuitenkin muuttaa tehtävästä löytyvien nuolien avulla.
          <br />
          <br />
          <strong>Tilastot:</strong> Täällä voit tarkastella erilaisia tilastoja
          tehtävistäsi. Voit tarkastella tehtävien ja tägien aktiivisia aikoja tai
          tarkastella tehtävien aktiivisuusintervalleja.
          <br />
          <br />
          <strong>Tietoa:</strong> Täällä voit lukea lisätietoja sovelluksesta.
          Olet tässä näkymässä juuri nyt.
          <br />
          <br />
          <strong>Asetukset:</strong> Täällä voit vaihtaa sovelluksen teemaa ja
          vaihtaa vaihtoehtoiseen moodiin, jossa vain yksi tehtävä voi olla
          kerrallaan aktiivisena.
        </p>
      </div>
      <div className={sectionName}>
        <h3>Ulkoisen materiaalin käyttö:</h3>
        <p>
          Kaikki sovelluksessa käytetty materiaali on itse tuotettua poislukien
          yleiset vapaasti käytössä olevat kirjastot.
        </p>
      </div>
      <div className={sectionName}>
        <h3>AI-Työkalut:</h3>
        <p>
          Tekoälyä on hyödynnetty kehityksessä kysymällä yleisellä tasolla
          neuvoja ja ohjeita Reactiin ja CSS tyylien ja layoutin toteuttamiseen.
          Siitä oli erityisesti apua hyvältä näyttävien värien keksimisessä ja
          materialUI kirjaston komponenttien toiminnan selvittämisessä.
        </p>
      </div>
      <div className={sectionName}>
        <h3>Harkoitustyöhön käytetty työtuntimäärä:</h3>
        <p>60 h</p>
      </div>
      <div className={sectionName}>
        <h3>Vaikeimmat ominaisuudet:</h3>
        <p>
          Useat ominaisuudet olivat haastavia toteuttaa, erityisesti siltä osin,
          että ominaisuus toimii ilman bugeja eikä kaada sovellusta. Monesta
          ominaisuudessa tuntui löytyvän edge caseja jatkuvasti ja koska koodin
          laatu ja hallittavuus on välillä kyseenalaisella tasolla niin bugien
          korjaus oli vaikeaa ja työlästä. Vaikeimmat ominaisuudet itsessään
          olivat kokonaisaikojen ja aktiivisuusintervallien laskeminen.
        </p>
      </div>
    </div>
  );
};

export default About;
