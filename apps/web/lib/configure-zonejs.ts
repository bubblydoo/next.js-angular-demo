import { zoneConfig } from '@rx-angular/cdk/zone-configurations';

export default function configureZonejs() {
  zoneConfig.global.disable.requestAnimationFrame();
  zoneConfig.global.disable.timers();
  zoneConfig.global.disable.ZoneAwarePromise();
  zoneConfig.unpatchXHR();
  zoneConfig.events.disable.UNPATCHED_EVENTS(['scroll', 'mousemove', 'resize']);
  zoneConfig.useUnpatchedPassiveScrollEvents();
}
