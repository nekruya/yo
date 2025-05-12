# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"] 