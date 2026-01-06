package com.cabinet.medical.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleEnum {
    ADMINISTRATEUR,
    MEDECIN,
    SECRETAIRE;

    @JsonValue
    public String getValue() {
        return this.name();
    }
}