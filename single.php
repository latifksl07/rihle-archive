<?php
/**
 * Rihle Archive - Tekil Yazı Şablonu (single.php)
 * WordPress Standart Post Şablonu ve comments_template() Entegrasyonu
 *
 * @package RihleArchive
 */

get_header(); ?>

<main id="primary" class="site-main py-5">
    <div class="container" style="max-width: 860px;">

        <?php
        while ( have_posts() ) :
            the_post();
            ?>

            <!-- Ekmek Kırıntısı (Breadcrumb) - Doğrudan ve Ara Katmansız -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb small">
                    <li class="breadcrumb-item"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Ana Sayfa</a></li>
                    <?php
                    // Tek bir kategori varsa veya doğrudan ana kategori gösterimi:
                    $categories = get_the_category();
                    if ( ! empty( $categories ) ) :
                        $cat = $categories[0];
                        ?>
                        <li class="breadcrumb-item"><a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"><?php echo esc_html( $cat->name ); ?></a></li>
                    <?php endif; ?>
                    <li class="breadcrumb-item active" aria-current="page"><?php the_title(); ?></li>
                </ol>
            </nav>

            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header mb-4">
                    <?php
                    if ( ! empty( $categories ) ) : ?>
                        <span class="badge bg-danger mb-2 px-3 py-2 text-uppercase fw-semibold" style="letter-spacing: 1px;">
                            <?php echo esc_html( $categories[0]->name ); ?>
                        </span>
                    <?php endif; ?>

                    <h1 class="entry-title display-5 font-serif fw-bold mb-3" style="color: var(--color-primary); line-height: 1.25;">
                        <?php the_title(); ?>
                    </h1>

                    <div class="entry-meta d-flex flex-wrap align-items-center gap-3 text-muted small pb-4 mb-4 border-bottom">
                        <span><i class="bi bi-person-circle me-1 text-terracotta"></i> <strong><?php the_author(); ?></strong></span>
                        <span>&bull;</span>
                        <span><i class="bi bi-calendar3 me-1 text-terracotta"></i> <?php echo get_the_date(); ?></span>
                        <span>&bull;</span>
                        <span><i class="bi bi-chat-text me-1 text-terracotta"></i> <?php comments_number( 'Yorum Yok', '1 Yorum', '% Yorum' ); ?></span>
                    </div>
                </header>

                <?php if ( has_post_thumbnail() ) : ?>
                    <div class="post-thumbnail mb-5">
                        <?php the_post_thumbnail( 'large', array( 'class' => 'img-fluid rounded-4 shadow-sm w-100', 'style' => 'max-height: 460px; object-fit: cover;' ) ); ?>
                    </div>
                <?php endif; ?>

                <div class="entry-content article-content fs-5 lh-lg" style="color: #382e28;">
                    <?php
                    the_content();

                    wp_link_pages( array(
                        'before' => '<div class="page-links">' . esc_html__( 'Sayfalar:', 'rihle' ),
                        'after'  => '</div>',
                    ) );
                    ?>
                </div>

                <footer class="entry-footer py-4 my-5 border-top border-bottom d-flex flex-wrap justify-content-between align-items-center">
                    <div class="entry-tags">
                        <?php the_tags( '<span class="small fw-bold text-muted me-2">Etiketler:</span> <span class="badge bg-light text-dark border me-1">', '</span> <span class="badge bg-light text-dark border me-1">', '</span>' ); ?>
                    </div>
                </footer>
            </article>

            <?php
            // ===================================================================
            // Standart WordPress Yorum Alanını Yükle (comments_template)
            // ===================================================================
            if ( comments_open() || get_comments_number() ) :
                comments_template();
            endif;

        endwhile; // Döngü sonu.
        ?>

    </div>
</main>

<?php
get_footer();

