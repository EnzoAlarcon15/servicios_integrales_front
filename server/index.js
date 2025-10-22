// ... existing code ...
import cors from 'cors';
app.use(cors({
  origin: ['https://relaxed-kitsune-d0a2d0.netlify.app'],
  credentials: true,
}));
// ... existing code ...