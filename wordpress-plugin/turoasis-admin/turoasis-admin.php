<?php
/**
 * Plugin Name: Turoasis Admin
 * Description: Panel editorial personalizado para gestionar tours Turoasis.
 * Version: 1.0.5
 */

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function () {
    add_menu_page('Turoasis Admin', 'Turoasis Admin', 'edit_posts', 'turoasis-admin', 'turoasis_admin_render', 'dashicons-palmtree', 3);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_turoasis-admin') return;
    wp_enqueue_media();
    wp_enqueue_script('wp-api-fetch');
    wp_enqueue_script('turoasis-admin', plugin_dir_url(__FILE__) . 'admin.js', ['wp-api-fetch'], '1.0.5', true);
    wp_localize_script('turoasis-admin', 'turoasisAdmin', [
        'apiRoot' => esc_url_raw(home_url('/index.php?rest_route=/wp/v2/')),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
    wp_enqueue_style('turoasis-admin', plugin_dir_url(__FILE__) . 'admin.css', [], '1.0.5');
});

function turoasis_admin_render() {
    echo '<div id="turoasis-admin-app"></div>';
}