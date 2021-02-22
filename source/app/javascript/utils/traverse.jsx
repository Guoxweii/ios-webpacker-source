import _ from 'lodash';

export default function traverse(collection, context, action) {
  _.each(collection, function(item) {
    action(item, context, action);
  });

  return context;
}
