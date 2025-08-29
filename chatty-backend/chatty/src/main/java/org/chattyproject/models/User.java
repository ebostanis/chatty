package org.chattyproject.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Basic
    @Column(name = "password_hash",  nullable = false, length = 50)
    private String passwordHash;

    @Basic
    @Column(name = "subscription")
    private String subscription;

}
