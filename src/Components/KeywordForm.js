import React, { useState } from 'react';
import './KeywordForm.css';
import axios from 'axios';

const apiKey=process.env.REACT_APP_API_KEY;

const KeywordForm = () => {

  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            order: 'viewCount',
            q: keyword,
            type: 'video',
            key: apiKey, 
        }}
      );

      if (response.data.items.length > 0) {
        const maxViewCountVideoId = response.data.items[0].id.videoId;
        

        
        try {
          const secondResponse = await axios.get(
            'https://youtube.googleapis.com/youtube/v3/videos',
            {
              params: {
                part: 'statistics',
                id: maxViewCountVideoId,
                key: apiKey,
              },
            }
          );

          
          
          const videoStatistics=secondResponse.data.items[0].statistics;
          const viewCount=videoStatistics.viewCount;

          const keywordSearchVolume=Number(viewCount)/5;
          setResult(Math.round(keywordSearchVolume));
          //Dividing by 5 since each result page had 5 video entries

        } catch (error) {
          console.error('Error fetching data from other API:', error);
        }
      }
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="container">
    <h1>Keyword Search Volume 🔊</h1>
    <form onSubmit={handleSubmit}>
    <label htmlFor="keywordInput">Type the keyword:</label>
    <input
      type="text"
      id="keywordInput"
      value={keyword}
      onChange={handleInputChange}
      placeholder="Enter keyword"
      required
    />
    <button type="submit">Submit</button>
    {result && <h2>The guestimated search volume for {keyword} is: {result}</h2>}
  </form>
</div>
  );
};

export default KeywordForm;