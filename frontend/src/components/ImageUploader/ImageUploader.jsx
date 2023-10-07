import React, { useState } from "react";
import "./ImageUploader.scss";
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState();
  const [caption, setCaption] = useState("");

  const formSubmit = async () => {
    console.log("formSubmit");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    console.log(
      "🚀 ~ file: ImageUploader.jsx:17 ~ formSubmit ~ process.env.REACT_APP_BACKEND_API:",
      process.env.REACT_APP_BACKEND_API
    );
    await axios.post("http://localhost:3001/api/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div className="upload">
      <span>Upload file to S3 bucket</span>
      <form onSubmit={formSubmit}>
        <input
          type="file"
          name="imageFile"
          className="inputFile"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          type="text"
          name="caption"
          placeholder="Enter caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default ImageUploader;
