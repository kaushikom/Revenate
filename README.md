# Revenate

This is a full-stack MERN application that allows users to upload an product image and generate a video using Runway's AI model. The app is designed to be fast, efficient, and mobile-friendly, offering a smooth user experience with real-time feedback.

---

## 🧠 AI Model Choice

We chose **Runway** as the AI model provider for generating videos from images. Runway offers:

- ⚡ Fast inference times
- 🎯 High-quality video outputs
- 🔌 A reliable and easy-to-integrate API
- 📈 Scalable infrastructure

Runway stood out as a balanced option between performance, ease of use, and output quality — ideal for production-ready image-to-video transformation.

---

## 🔁 How the Pipeline Works

1. **User Uploads an Image**
   - The frontend accepts an image upload from the user.
   - The image is uploaded to **Cloudinary**, a cloud storage platform.

2. **Runway API Call**
   - The generated Cloudinary URL is sent to Runway’s API to start a video generation job.
   - Runway returns a `job ID`.

3. **Polling for Status**
   - The backend continuously polls the Runway API to check the status of the job.
   - Once the status is `succeeded`, a video URL is returned.

4. **Uploading Generated Video**
   - The video URL from Runway is downloaded and re-uploaded to **Cloudinary**.
   - This allows for easier and faster video delivery to the frontend.

5. **User Preview**
   - The frontend receives the final Cloudinary video URL and renders it in a mobile-friendly preview box.

---

## ⚠️ Limitations and Assumptions

While the app is fully functional, here are a few limitations to consider:

### 🚧 Limitations

- **Cloudinary Free Tier**: Limited storage and bandwidth. Videos and images may need cleanup or quota management.
- **Runway Cost**: Runway is not free for high-volume or commercial use. You may incur charges based on usage.
- **Job Polling Latency**: The app uses polling to check job status, which could introduce delays or inefficiencies.
- **No Auth-Based Access to Media**: Anyone with the Cloudinary video URL can access the content.
- **Image Input Assumptions**:
  - Assumes user-uploaded images are appropriate for video generation.
  - Model quality depends on image resolution and composition.

---

### Setup Instructions

- Clone the repository
- Install node packages for both frontend and backend module using : npm install
- Use .env.sample file for reference to create your own .env file
- Run frontend and backend both using npm run dev command

