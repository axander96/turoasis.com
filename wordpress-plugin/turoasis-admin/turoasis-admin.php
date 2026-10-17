<?php
/**
 * Plugin Name: Turoasis Admin
 * Description: Panel editorial personalizado para gestionar tours Turoasis.
 * Version: 1.0.7
 */

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function () {
    add_menu_page('Turoasis Admin', 'Turoasis Admin', 'edit_posts', 'turoasis-admin', 'turoasis_admin_render', 'dashicons-palmtree', 3);
});

add_action('rest_api_init', function () {
    register_rest_route('turoasis/v1', '/homepage', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () { return get_option('turoasis_homepage', []); },
    ]);
    register_rest_route('turoasis/v1', '/homepage', [
        'methods' => 'POST',
        'permission_callback' => function () { return current_user_can('edit_posts'); },
        'callback' => function (WP_REST_Request $request) {
            $value = $request->get_json_params();
            update_option('turoasis_homepage', is_array($value) ? $value : []);
            return get_option('turoasis_homepage', []);
        },
    ]);
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'toplevel_page_turoasis-admin') return;
    wp_enqueue_media();
    wp_enqueue_script('wp-api-fetch');
    wp_enqueue_script('turoasis-admin', plugin_dir_url(__FILE__) . 'admin.js', ['wp-api-fetch'], '1.0.7', true);
    wp_enqueue_script('turoasis-homepage', plugin_dir_url(__FILE__) . 'homepage.js', ['turoasis-admin'], '1.0.0', true);
    wp_localize_script('turoasis-admin', 'turoasisAdmin', [
        'apiRoot' => esc_url_raw(home_url('/index.php?rest_route=/wp/v2/')),
        'nonce' => wp_create_nonce('wp_rest'),
        'homepageRoot' => esc_url_raw(home_url('/index.php?rest_route=/turoasis/v1/homepage')),
    ]);
    wp_enqueue_style('turoasis-admin', plugin_dir_url(__FILE__) . 'admin.css', [], '1.0.7');
    wp_enqueue_style('turoasis-homepage', plugin_dir_url(__FILE__) . 'homepage.css', [], '1.0.0');
});

function turoasis_admin_render() {
    echo '<div id="turoasis-admin-app"></div>';
}