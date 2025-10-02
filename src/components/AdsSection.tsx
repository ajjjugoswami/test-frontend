import React from "react";
import { Box, Typography } from "@mui/material";

const AdsSection: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            textAlign: "center",
          }}
        >
          Explore More AI Tools
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          textAlign: "center",
          mb: 3,
        }}
      >
        While you're here, discover our other AI-powered platforms
      </Typography>

      {/* Ads Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          width: "100%",
        }}
      >
        {/* Chat with Aithor */}
        <Box
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            p: 3,
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              borderColor: "#10b981",
            },
          }}
          onClick={() =>
            window.open("https://chat-with-aithor.vercel.app/", "_blank")
          }
        >
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: "#10b98115",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              💬
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
              >
                Chat with Aithor
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}
              >
                Engage in intelligent conversations with our AI assistant. Get
                instant answers and creative solutions.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#10b98115",
                color: "#10b981",
                px: 2,
                py: 0.5,
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              AI Chat
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Try Now →
            </Typography>
          </Box>
        </Box>

        {/* Image Builder */}
        <Box
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            p: 3,
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              borderColor: "#3b82f6",
            },
          }}
          onClick={() =>
            window.open("https://staging-image-builder.vercel.app/", "_blank")
          }
        >
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: "#3b82f615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              🎨
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
              >
                Image Builder
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}
              >
                Create stunning visuals and graphics with our advanced
                AI-powered image generation tool.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#3b82f615",
                color: "#3b82f6",
                px: 2,
                py: 0.5,
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Image AI
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Try Now →
            </Typography>
          </Box>
        </Box>

        {/* Podcast Generator */}
        <Box
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            p: 3,
            backgroundColor: "white",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              borderColor: "#8b5cf6",
            },
          }}
          onClick={() =>
            window.open("https://staging-podcast.vercel.app/", "_blank")
          }
        >
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                backgroundColor: "#8b5cf615",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              🎙️
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
              >
                Podcast Generator
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}
              >
                Transform your content into engaging podcasts with AI-generated
                voices and professional quality.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#8b5cf615",
                color: "#8b5cf6",
                px: 2,
                py: 0.5,
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Audio AI
            </Box>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Try Now →
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Promotional banner */}
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          🚀 More AI Tools Coming Soon!
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.9rem", opacity: 0.9, lineHeight: 1.4 }}
        >
          Stay tuned for more innovative AI-powered tools to enhance your
          productivity.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdsSection;
