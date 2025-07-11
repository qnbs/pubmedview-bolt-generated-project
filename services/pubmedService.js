const axios = require('axios');
const API_KEY = process.env.PUBMED_API_KEY;

const pubmedService = {
  /**
   * Search PubMed articles
   * @param {string} query - Search terms
   * @param {number} retmax - Maximum results to return
   * @returns {Promise<Object>} - Formatted API response
   */
  async searchArticles(query, retmax) {
    try {
      const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
      const params = {
        db: 'pubmed',
        term: query,
        retmode: 'json',
        retmax,
        api_key: API_KEY
      };

      const response = await axios.get(baseUrl, { params });
      
      if (response.data.esearchresult.errorlist?.error) {
        throw new Error(response.data.esearchresult.errorlist.error[0]);
      }

      return {
        count: parseInt(response.data.esearchresult.count, 10),
        ids: response.data.esearchresult.idlist,
        query: response.data.esearchresult.querytranslation
      };
    } catch (error) {
      console.error('PubMed API error:', error.message);
      throw new Error('Failed to retrieve data from PubMed API');
    }
  }
};

module.exports = pubmedService;
