import React from 'react';
import Slider from 'react-slick';
import { Box, Card, CardContent, CardMedia, Typography, useTheme } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Feature {
  title: string;
  description: string;
  image: string;
}

const features: Feature[] = [
  {
    title: 'Select Your Exotic',
    description:
      'D2Loadout lets you select or search for the desired exotic armor or exotic class item based on perks to your build.',
    image: 'https://i.imgur.com/BpXCQ1O.gif',
  },
  {
    title: 'Customize Your Subclass',
    description:
      'Experience a modern UI, mirroring the in-game interface, where you can apply aspects and fragments, factoring in stat bonuses and penalties.',
    image: 'https://imgur.com/8vl4y6S.gif',
  },
  {
    title: 'Optimize Your Stats',
    description:
      'Choose the highest stats and best armor combinations with advanced filters to refine your build based on your needs.',
    image: 'https://imgur.com/VPxoQzB.gif',
  },
  {
    title: 'Armor Selection',
    description: 'Easily sort and select armor based on mod capacity, energy cost, and armor type.',
    image: 'https://imgur.com/SmEXjTL.gif',
  },
  {
    title: 'Apply Armor Mods',
    description:
      'Apply all in-game armor mods and fine-tune your build—all in one convenient place.',
    image: 'https://imgur.com/N3LRQ0L.gif',
  },
  {
    title: 'Equip Your Loadout',
    description:
      'Equip your loadout from offline or in orbit. If your inventory is full, items are automatically transferred to your vault to make space.',
    image: 'https://imgur.com/z69q3wD.gif',
  },
  {
    title: 'Share Your Build',
    description:
      'Generate a link that captures your preferred stats, armor mods, and subclass mods. Share it with friends or followers, enabling them to apply the loadout in-game with a single click.',
    image: 'https://via.placeholder.com/400x200?text=Share+Your+Build',
  },
  {
    title: 'Looking Ahead!',
    description:
      "Future updates will include a community hub for sharing builds, complete with a survey system to gather player feedback and a ranking system for popular streamers' recommended builds.",
    image: 'https://via.placeholder.com/400x200?text=Looking+Ahead',
  },
];

const FeatureSlider: React.FC = () => {
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    cssEase: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
    arrows: false,
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        margin: 'auto',
        position: 'relative',
        '& .slick-dots': {
          bottom: '-25px',
          textAlign: 'center',
        },
        '& .slick-dots li button:before': {
          color: theme.palette.common.white,
        },
      }}
    >
      <Slider {...settings}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </Slider>
    </Box>
  );
};

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Card
        sx={{
          maxWidth: 600,
          margin: 'auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '0px',
        }}
      >
        <CardMedia component="img" height="200" image={feature.image} alt={feature.title} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="white"
            align="left"
            sx={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            {feature.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
            align="left"
          >
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeatureSlider;
