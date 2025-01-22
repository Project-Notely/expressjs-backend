import axios from "axios";

export const mockAuth0TokenEndpoint = () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
            access_token: "mock-access-token",
            id_token: "mock-id-token",
        }
    });
};

export const mockAuth0UserInfoEndpoint = () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
        data: {
            sub: "auth0|123",
            email: "test@example.com",
            name: "Test User",
            picture: "https://example.com/picture.jpg",
        }
    });
};