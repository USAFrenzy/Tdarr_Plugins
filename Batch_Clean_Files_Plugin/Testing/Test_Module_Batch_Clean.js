import { test_file } from './Parameter_Files/test_file.js';
import { test_libSettings } from './Parameter_Files/test_libSettings.js';
import { test_otherArguments } from './Parameter_Files/test_otherArguments.js';
import { test_inputs } from './Parameter_Files/test_inputs.js';

import { plugin } from '../Tdarr_Plugin_rm01_batch_clean_filenames';

plugin(test_file, test_libSettings, test_inputs, test_otherArguments);
