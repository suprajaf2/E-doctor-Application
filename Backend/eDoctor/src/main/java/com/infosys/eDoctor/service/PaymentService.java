package com.infosys.eDoctor.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    public String createCheckoutSession(int appointmentId, double amount) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .putMetadata("appointmentId", String.valueOf(appointmentId))
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("inr")
                                .setUnitAmount((long) (amount * 100))
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Medical Appointment")
                                        .setDescription("Appointment ID: " + appointmentId)
                                        .build())
                                .build())
                        .setQuantity(1L)
                        .build())
                .build();
        Session session = Session.create(params);
        return session.getUrl();
    }

    public Session verifyPayment(String sessionId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;
        return Session.retrieve(sessionId);
    }
}