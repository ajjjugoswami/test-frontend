import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
  CardMedia,
  CardActions,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { generateImage } from "../services";

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const result = await generateImage({
        prompt,
        referenceImage: imageFile || undefined,
      });
      setGeneratedImage(result);
      setPrompt("");
      setImageFile(null);
      setUploadedImageUrl(null);
    } catch (error) {
      console.error("Error generating image:", error);
      alert(
        `Error generating image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 5 }, px: { xs: 0, md: 5 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          mb: 4,
          backgroundColor: "#fff",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Describe the modification
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g., Make the background sunset-themed"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        {uploadedImageUrl && (
          <Chip
            avatar={<Avatar src={uploadedImageUrl} />}
            label="Uploaded Image"
            onDelete={() => {
              setImageFile(null);
              setUploadedImageUrl(null);
            }}
            sx={{ mb: 3 }}
          />
        )}

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3, alignItems: { xs: "stretch", md: "center" } }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<Upload />}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleGenerate}
            disabled={loading}
            startIcon={<ImageIcon />}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Image"}
          </Button>
        </Box>
      </Paper>

      {generatedImage && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardMedia
            component="img"
            image={generatedImage}
            alt="Generated"
            sx={{ height: { xs: 300, md: 500 }, objectFit: "contain", width: "100%" }}
          />
          <CardActions>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownload}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Download
            </Button>
          </CardActions>
        </Paper>
      )}
    </Container>
  );
};

export default ImageEditor;
