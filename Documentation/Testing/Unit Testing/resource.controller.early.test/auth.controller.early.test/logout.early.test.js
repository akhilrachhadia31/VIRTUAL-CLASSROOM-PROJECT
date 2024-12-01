// Unit tests for: logout

import { logout } from "../../controller/auth.controller.js";

// Import necessary modules
// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Test suite for the logout function
describe("logout() logout method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("should return a success message when logout is called", () => {
      // Arrange: Set up the mock response object
      const res = mockResponse();

      // Act: Call the logout function
      logout({}, res);

      // Assert: Check that the response status and message are correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle unexpected additional properties in the request object gracefully", () => {
      // Arrange: Set up the mock response object and a request with additional properties
      const res = mockResponse();
      const req = { unexpectedProperty: "unexpectedValue" };

      // Act: Call the logout function
      logout(req, res);

      // Assert: Check that the response status and message are correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out successfully",
      });
    });

    it("should handle a missing response object gracefully", () => {
      // Arrange: Set up a request object
      const req = {};

      // Act & Assert: Call the logout function and expect it not to throw an error
      expect(() => logout(req, null)).not.toThrow();
    });
  });
});

// End of unit tests for: logout
