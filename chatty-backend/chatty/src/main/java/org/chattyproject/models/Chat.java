package org.chattyproject.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chats", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Basic
    @Column(name = "title")
    private String title;

    @Basic
    @Column(name = "archived")
    private Boolean archived;

}
