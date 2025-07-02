const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || `Request failed with status ${response.status}`);
    } catch (parseError) {
      // If response isn't JSON or is empty
      const textError = await response.text();
      throw new Error(textError || `Request failed with status ${response.status}`);
    }
  }
  
  // Handle empty successful responses (common for DELETE)
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || response.status === 204) {
    return null;
  }
  
  return response.json();
};

// saveReport function
export const saveReport = async (reportData) => {
  try {
    if (!reportData?.header?.reportNumber) {
      throw new Error('Report number is required in the header');
    }

    const response = await fetch(`${API_BASE_URL}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving report:', error);
    throw error;
  }
};

//Template API functions
export const fetchTemplates = async () => {
  const response = await fetch(`${API_BASE_URL}/api/templates`);
  return handleResponse(response);
};

export const saveTemplate = async (template) => {
  const response = await fetch(`${API_BASE_URL}/api/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });
  return handleResponse(response);
};

export const deleteTemplate = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};