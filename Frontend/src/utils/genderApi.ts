import axios from "axios";


export const checkGender = async (name: string) => {
  try {
    const response = await axios.get(`https://api.genderize.io?name=${name}`);
    const { gender, probability } = response.data;

    if (gender) {
      console.log(`Detected gender: ${gender} (${probability * 100}%)`);
      return gender;
    } else {
      console.log("Gender not found");
      return null;
    }
  } catch (error) {
    console.error("Error checking gender:", error);
    return null;
  }
};





