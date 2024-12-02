import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  // This should be refactored later on to support n amount of tags
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async () => {
    if (taskName === "") return;

    let tagIds = [];
    if (tag1.trim() !== "") {
      const res = await axios.post("http://localhost:3010/tags", { name: tag1 });
      tagIds.push(res.data.id);
    }

    if (tag2.trim() !== "") {
      const res = await axios.post("http://localhost:3010/tags", { name: tag2 });
      tagIds.push(res.data.id);
    }

    if (tag3.trim() !== "") {
      const res = await axios.post("http://localhost:3010/tags", { name: tag3 });
      tagIds.push(res.data.id);
    }

    const res = await axios.post("http://localhost:3010/tasks", {name: taskName, tags: tagIds.join(",")});
    navigate("/");

  };

  return (
    <div className="form">
      <h2>Uusi tehtävä</h2>
      <label htmlFor="taskName">
        Tehtävän nimi
      </label>
      <input
        type="text"
        id="taskName"
        value={taskName}
        maxLength={40}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <h2>Tägit:</h2>
      <label htmlFor="tag1">Tägi 1</label>
      <input
        type="text"
        id="tag1"
        value={tag1}
        maxLength={40}
        onChange={(e) => setTag1(e.target.value)}
      />
      <label htmlFor="tag2">Tägi 2</label>
      <input
        type="text"
        id="tag2"
        value={tag2}
        maxLength={40}
        onChange={(e) => setTag2(e.target.value)}
      />
      <label htmlFor="tag3">Tägi 3</label>
      <input
        type="text"
        id="tag3"
        value={tag3}
        maxLength={40}
        onChange={(e) => setTag3(e.target.value)}
      />
      <button onClick={() => handleSubmit()}>Lisää tehtävä</button>
    </div>
  );
};

export default AddTask;
