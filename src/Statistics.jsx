/* eslint react/prop-types: */
import { useState } from "react";
import { Button } from "@mui/material";
import ActivityIntervals from "./ActivityIntervals";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import TotalActiveTimes from "./TotalActiveTimes";
import BarChart from "./Barchart";
import "./Statistics.css";
import { useTheme } from "@emotion/react";
import OpenFeatureButton from "./OpenFeatureButton";

const Statistics = ({ tasks, timestamps, tags }) => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const theme = useTheme();

  const RenderFeature = () => {
    if (selectedFeature === "Aktiivisuusajat") {
      return (
        <TotalActiveTimes tasks={tasks} timestamps={timestamps} tags={tags} />
      );
    }
    if (selectedFeature === "Intervallit") {
      return <ActivityIntervals tasks={tasks} timestamps={timestamps} />;
    }

    if (selectedFeature === "Pylväsdiagrammi") {
      return <BarChart tasks={tasks} timestamps={timestamps} />;
    }
  };

  const PopupWrapper = ({ feature, title }) => {
    return (
      <Dialog
        open={selectedFeature === feature && selectedFeature !== ""}
        onClose={() => setSelectedFeature("")}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{<RenderFeature />}</DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFeature("")}>Sulje</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <div className={theme.palette.mode === "light" ? "lightStats" : "darkStats"}>
        <div style={{ textAlign: "left" }}>
          <h3>Tilastot</h3>
          <p> Valitse haluamasi tilastotieto:</p>
          <p>
            <strong>Aktiivisuusajat:</strong> Näytttää tehtävien ja niihiin
            liittyvien tägien kokonaisaktiivisuusajan valitsemaltasi
            aikaväliltä.
          </p>
          <p>
            <strong>Intervallit:</strong> Näyttää yksittäisen tehtävän
            aktivointi ja lopeusajat valitsemaltasi aikaväliltä.
          </p>
          <p>
            <strong>Pylväsdiagrammi:</strong> Piirtää pylväsdiagrammin
            yksittäisen tehtävän kokonaisaktiivisuusajoista eri päivinä
            valitsemaltasi aikaväliltä.
          </p>
        </div>
        <div className="buttonContainer">
          <OpenFeatureButton
            onClick={() => setSelectedFeature("Aktiivisuusajat")}
            text="Aktiivisuusajat"
          />
          <OpenFeatureButton
            onClick={() => setSelectedFeature("Intervallit")}
            text="Intervallit"
          />
          <OpenFeatureButton
            onClick={() => setSelectedFeature("Pylväsdiagrammi")}
            text="Pylväsdiagrammi"
          />
        </div>
        <PopupWrapper feature={selectedFeature} title={selectedFeature} />
      </div>
    </>
  );
};

export default Statistics;
