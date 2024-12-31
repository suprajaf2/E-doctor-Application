package com.infosys.eDoctor.DTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class PaymentDTO {
    private String cardNumber;
    private String expMonth;
    private String expYear;
    private String cvc;
    private int amount;
    private String currency;
    private int appointmentId;
    // Getters and setters
}
