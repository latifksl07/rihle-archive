<?php
/**
 * Rihle Archive - Yorumlar Şablonu (comments.php)
 * Ziyaretçilerin isim, e-posta ve yorum bırakabileceği standart form
 *
 * @package RihleArchive
 */

if ( post_password_required() ) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php if ( have_comments() ) : ?>
        <h3 class="comments-title">
            <i class="bi bi-chat-dots text-terracotta me-2"></i>
            <?php
            $comment_count = get_comments_number();
            if ( '1' === $comment_count ) {
                printf( esc_html__( 'Okur Yorumu (1)', 'rihle' ) );
            } else {
                printf(
                    /* translators: 1: yorum sayısı */
                    esc_html( _nx( 'Okur Yorumu (%1$s)', 'Okur Yorumları (%1$s)', $comment_count, 'yorumlar başlığı', 'rihle' ) ),
                    number_format_i18n( $comment_count )
                );
            }
            ?>
        </h3>

        <ul class="comment-list">
            <?php
            wp_list_comments( array(
                'style'      => 'ul',
                'short_ping' => true,
                'avatar_size'=> 48,
            ) );
            ?>
        </ul>

        <?php
        the_comments_navigation();

        if ( ! comments_open() ) :
            ?>
            <p class="no-comments alert alert-secondary small"><?php esc_html_e( 'Bu yazı için yorumlar kapatılmıştır.', 'rihle' ); ?></p>
            <?php
        endif;

    endif; // have_comments() sonu.
    ?>

    <div class="comment-form-box">
        <?php
        // WordPress Standart Yorum Formu (İsim, E-posta, Yorum Alanı)
        $commenter = wp_get_current_commenter();
        $req       = get_option( 'require_name_email' );
        $aria_req  = ( $req ? " aria-required='true' required" : '' );

        $fields = array(
            'author' => '<div class="row g-3 mb-3">' .
                        '<div class="col-md-6">' .
                        '<label for="author" class="form-label small fw-bold">' . __( 'Adınız Soyadınız', 'rihle' ) . ( $req ? ' *' : '' ) . '</label>' .
                        '<input id="author" name="author" type="text" class="form-control" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . ' placeholder="Adınız Soyadınız">' .
                        '</div>',
            'email'  => '<div class="col-md-6">' .
                        '<label for="email" class="form-label small fw-bold">' . __( 'E-Posta Adresiniz', 'rihle' ) . ( $req ? ' *' : '' ) . '</label>' .
                        '<input id="email" name="email" type="email" class="form-control" value="' . esc_attr( $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . ' placeholder="ornek@domain.com">' .
                        '</div></div>',
            'cookies' => '<div class="form-check mb-3">' .
                         '<input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" class="form-check-input" value="yes"' . ( empty( $commenter['comment_author_email'] ) ? '' : ' checked="checked"' ) . '>' .
                         '<label class="form-check-label small text-muted" for="wp-comment-cookies-consent">' . __( 'Bir dahaki sefere yorum yaptığımda kullanılmak üzere adımı ve e-posta adresimi bu tarayıcıya kaydet.', 'rihle' ) . '</label>' .
                         '</div>',
        );

        $comments_args = array(
            'fields'        => $fields,
            'title_reply'   => __( 'Bir Yorum Bırakın', 'rihle' ),
            'title_reply_to'=> __( '%s Adlı Kişiye Cevap Verin', 'rihle' ),
            'comment_notes_before' => '<p class="comment-notes">' . __( 'E-posta adresiniz yayımlanmayacaktır. Gerekli alanlar * ile işaretlenmiştir.', 'rihle' ) . '</p>',
            'comment_field' => '<div class="mb-3">' .
                               '<label for="comment" class="form-label small fw-bold">' . __( 'Yorumunuz', 'rihle' ) . ' *</label>' .
                               '<textarea id="comment" name="comment" class="form-control" rows="5" required placeholder="Düşüncelerinizi buraya yazabilirsiniz..."></textarea>' .
                               '</div>',
            'class_submit'  => 'btn btn-rihle px-4 py-2',
            'submit_button' => '<button name="%1$s" type="submit" id="%2$s" class="%3$s"><i class="bi bi-chat-left-text-fill me-1"></i> %4$s</button>',
            'label_submit'  => __( 'Yorumu Gönder', 'rihle' ),
        );

        comment_form( $comments_args );
        ?>
    </div>

</div><!-- #comments -->

