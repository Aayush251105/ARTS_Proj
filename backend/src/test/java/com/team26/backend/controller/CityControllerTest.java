package com.team26.backend.controller;

import com.team26.backend.model.City;
import com.team26.backend.repository.CityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CityControllerTest {

    @Mock
    private CityRepository cityRepository;

    @InjectMocks
    private CityController cityController;

    private City city;

    @BeforeEach
    void setUp() {
        city = new City();
        city.setCityId(1);
        city.setName("Delhi");
        city.setIsInternational(true);
    }

    @Test
    void testGetAllCities() {
        // Arrange: Tell the mock repository what to return
        when(cityRepository.findAll()).thenReturn(Arrays.asList(city));

        // Act: Call the method we are testing
        List<City> cities = cityController.getAllCities();

        // Assert: Verify the results
        assertNotNull(cities);
        assertEquals(1, cities.size());
        assertEquals("Delhi", cities.get(0).getName());
        verify(cityRepository, times(1)).findAll();
    }

    @Test
    void testGetCityById_Found() {
        when(cityRepository.findById(1)).thenReturn(Optional.of(city));

        ResponseEntity<City> response = cityController.getCityById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Delhi", response.getBody().getName());
    }

    @Test
    void testGetCityById_NotFound() {
        when(cityRepository.findById(2)).thenReturn(Optional.empty());

        ResponseEntity<City> response = cityController.getCityById(2);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testCreateCity() {
        when(cityRepository.save(any(City.class))).thenReturn(city);

        City createdCity = cityController.createCity(city);

        assertNotNull(createdCity);
        assertEquals("Delhi", createdCity.getName());
        verify(cityRepository, times(1)).save(city);
    }
}