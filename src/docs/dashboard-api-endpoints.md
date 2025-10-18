# Dashboard API Endpoints

This document describes the API endpoints required for the dashboard functionality.

## Endpoints

### 1. GET /dashboard/certificates-expiring

Returns a list of certificates that are expiring soon.

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "ISO 9001:2015 Quality Management",
    "expiry": "2024-03-15",
    "daysUntilExpiry": 15,
    "status": "expiring_soon"
  },
  {
    "id": 2,
    "name": "ISO 14001:2015 Environmental Management", 
    "expiry": "2024-06-20",
    "daysUntilExpiry": 92,
    "status": "valid"
  }
]
```

### 2. GET /dashboard/main-stock-count

Returns the count of items in main stock.

**Response Format:**
```json
{
  "count": 1250,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 3. GET /dashboard/out-of-stock-count

Returns the count of items that are out of stock.

**Response Format:**
```json
{
  "count": 23,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 4. GET /dashboard/finished-goods-count

Returns the count of finished goods.

**Response Format:**
```json
{
  "count": 456,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Implementation Notes

- All endpoints should return appropriate HTTP status codes
- Include proper error handling and validation
- Consider implementing caching for better performance
- Add authentication/authorization as needed
- The `daysUntilExpiry` field should be calculated based on current date
- The `status` field should be "expiring_soon" for certificates expiring within 30 days, otherwise "valid"

## Frontend Integration

The frontend is currently using mock data for development. To switch to real API calls:

1. Update `src/services/dashboardService.js`
2. Uncomment the axios calls and comment out the mock data returns
3. Ensure the backend endpoints are implemented and accessible
4. Test the integration thoroughly
