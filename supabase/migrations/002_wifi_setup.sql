-- Lägg till wifi_setup_requested flagga för att trigga WiFi-byte från dashboard
alter table device_settings
add column wifi_setup_requested boolean default false;
