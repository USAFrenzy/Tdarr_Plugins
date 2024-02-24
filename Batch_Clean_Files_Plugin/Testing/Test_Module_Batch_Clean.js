// Purpose: To test the Batch Clean Filenames plugin.
// The functions are imported from the plugin file and the test files.
const {test_file} = require('./Parameter_Files/test_file.js')
const {test_libSettings} = require('./Parameter_Files/test_libSettings.js')
const {test_otherArguments} = require('./Parameter_Files/test_otherArguments.js')
const {test_inputs} = require('./Parameter_Files/test_inputs.js')
// The Workload is the plugin itself.
const {plugin} = require('../Tdarr_Plugin_rm01_batch_clean_filenames.js')


plugin(test_file(), test_libSettings(), test_inputs(), test_otherArguments());
