INSERT INTO users (id, name, email, password)
VALUES 
(1, 'Nate', 'stick@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Alexis', 'lick@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Christian', 'flick@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES 
(1, 1, 'Potato House', 'description', 'https://example.com/photo1', 'https://example.com/photo2', 1, 4, 19, 25, 'Canada', 'Dump Road', 'Calgary', 'Alberta', 'M5DJ2K', true),
(2, 2, 'Lard Room', 'description', 'https://example.com/photo3', 'https://example.com/photo4', 8, 43, 1, 5, 'United States', 'Superior Road', 'New York', 'New York', '83680', true),
(3, 3, 'Fart House', 'description', 'https://example.com/photo5', 'https://example.com/photo6', 100, 1, 1, 1, 'Canada', 'Thicc Road', 'Toronto', 'Ontario', 'M0N8JK', true);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES 
(1, '2019-10-12', '2020-01-02', 1, 1),
(2, '2022-09-22', '2023-09-22', 2, 2),
(3, '2023-03-03', '2023-03-04', 3, 3);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES 
(1, 1, 1, 1, 4.5, 'messages'),
(2, 2, 2, 2, 5, 'messages'),
(3, 3, 3, 3, 1.5, 'messages');
