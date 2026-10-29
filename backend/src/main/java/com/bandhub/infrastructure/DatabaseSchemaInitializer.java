package com.bandhub.infrastructure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseSchemaInitializer implements BeanPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaInitializer.class);

    private static final String[] SCHEMAS = {
        "schema_auth", "schema_users", "schema_social", "schema_marketplace",
        "schema_events", "schema_library", "schema_collab", "schema_chat",
        "schema_bands", "schema_agenda", "schema_admin", "schema_academy", "schema_places"
    };

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof DataSource dataSource) {
            log.info("[DatabaseSchemaInitializer] Ensuring multi-module database schemas exist...");
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                for (String schema : SCHEMAS) {
                    stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schema);
                }
                log.info("[DatabaseSchemaInitializer] Database schemas verified successfully.");
            } catch (Exception e) {
                log.warn("[DatabaseSchemaInitializer] Warning executing schema initialization: {}", e.getMessage());
            }
        }
        return bean;
    }
}
