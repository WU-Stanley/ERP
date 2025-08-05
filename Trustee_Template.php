<?php
/*
Template Name: Trustees Page
Board of trustees Content
Board of trustees Title
members_of_board_of_trustees
*/
get_header(); ?>

<section class="container py-5">
  <div class="row">
    <?php if (have_rows('trustees')): ?>
      <?php while (have_rows('trustees')): the_row();
        $name = get_sub_field('name');
        $photo = get_sub_field('photo');
        $short_bio = get_sub_field('short_bio');
        $long_bio = get_sub_field('long_bio');
        $id = uniqid('trustee_');
      ?>
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <?php if ($photo): ?>
            <img src="<?php echo esc_url($photo['url']); ?>" class="card-img-top rounded-0" alt="<?php echo esc_attr($name); ?>">
          <?php endif; ?>
          <div class="card-body">
            <h5 class="card-title text-primary"><?php echo esc_html($name); ?></h5>
            <p class="card-text"><?php echo esc_html($short_bio); ?></p>
            <button class="btn btn-outline-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#<?php echo $id; ?>">Read More</button>
          </div>
        </div>
      </div>

      <!-- Offcanvas Profile -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="<?php echo $id; ?>" aria-labelledby="<?php echo $id; ?>Label">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="<?php echo $id; ?>Label"><?php echo esc_html($name); ?></h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <?php if ($photo): ?>
            <img src="<?php echo esc_url($photo['url']); ?>" alt="<?php echo esc_attr($name); ?>" class="img-fluid mb-3 rounded">
          <?php endif; ?>
          <p><?php echo wp_kses_post($long_bio); ?></p>
        </div>
      </div>
      <?php endwhile; ?>
    <?php endif; ?>
  </div>
</section>

<?php get_footer(); ?>
