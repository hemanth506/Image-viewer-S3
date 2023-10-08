import fs from "fs/promises";

export const addFileData = async (imageData) => {
  console.log("🚀 ~ file: index.js:4 ~ addFileData ~ imageData:", imageData);
  try {
    const collection = await fs.readFile("./database/collections/images.json", {
      encoding: "utf8",
    });

    const parsedCollection = collection !== "" ? JSON.parse(collection) : "";
    let updatedCollection;

    if (parsedCollection !== "") {
      updatedCollection = {
        totalImageData: parsedCollection.data.length + 1,
        data: [...parsedCollection.data, imageData],
      };
    } else {
      updatedCollection = {
        totalImageData: 1,
        data: [imageData],
      };
    }
    await fs.writeFile(
      "./database/collections/images.json",
      JSON.stringify(updatedCollection)
    );
  } catch (err) {
    throw new Error("Error when uploading image data in db");
  }
};

export const getFileData = async () => {
  return new Promise((resolve, reject) => {
    const collection = fs.readFile("./database/collections/images.json", {
      encoding: "utf8",
    });
    if (collection) {
      resolve(collection);
    } else {
      console.log(
        "🚀 ~ file: index.js:42 ~ returnnewPromise ~ Error when fetching image data in db"
      );
      reject("Error when fetching image data in db");
    }
  });
};
