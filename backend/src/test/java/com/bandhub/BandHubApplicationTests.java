package com.bandhub;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BandHubApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void verifyModulithStructure() {
		org.springframework.modulith.core.ApplicationModules.of(BandHubApplication.class).verify();
	}

}
