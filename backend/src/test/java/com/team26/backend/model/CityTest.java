package com.team26.backend.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CityTest {

    @Test
    void testCityGettersAndSetters() {
        City city = new City();
        
        city.setCityId(1);
        city.setName("New York");
        city.setIsInternational(true);

        assertEquals(1, city.getCityId());
        assertEquals("New York", city.getName());
        assertTrue(city.getIsInternational());
    }

    @Test
    void testCityUpdate() {
        City city = new City();
        city.setName("Delhi");
        city.setIsInternational(true);

        city.setName("Mumbai");
        city.setIsInternational(false);

        assertEquals("Mumbai", city.getName());
        assertFalse(city.getIsInternational());
    }
}
