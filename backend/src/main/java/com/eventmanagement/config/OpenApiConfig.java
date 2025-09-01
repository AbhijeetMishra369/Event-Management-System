package com.eventmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {
	@Bean
	public OpenAPI eventHubOpenAPI() {
		return new OpenAPI()
			.info(new Info().title("EventHub API")
				.version("v1")
				.description("REST API for Event Management System")
				.contact(new Contact().name("EventHub").email("support@eventhub.local"))
				.license(new License().name("MIT")))
			.externalDocs(new ExternalDocumentation()
				.description("Project README")
				.url("https://example.com/docs"));
	}
}