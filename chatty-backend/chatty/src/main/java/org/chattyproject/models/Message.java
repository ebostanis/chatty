package org.chattyproject.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @Basic
    @Column(name = "role",  nullable = false)
    private String role;

    @Basic
    @Column(name = "content", nullable = false)
    private String content;

    @Basic
    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
